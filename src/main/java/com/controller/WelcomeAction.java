package com.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bean.Person;
import com.dao.TestDao;
import com.service.TestService;
import com.service.TransactionalService;
import io.netty.handler.codec.http.HttpResponse;
import javafx.print.Printer;
import org.codehaus.jackson.map.util.JSONPObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Scanner;
/**
 * Created by Administrator on 2019/1/27 0027.
 */
@Controller
@RequestMapping("WelcomeAction")
public class WelcomeAction {
    @Autowired
    private TestDao testDao ;//自动注入,可以直接使用的testDao来调用TestDao的方法，拿来即用
    @Autowired
    private TestService testService;
    @Autowired
    private TransactionalService transactionalService;
    private static final Logger logger = LoggerFactory.getLogger(WelcomeAction.class);
    @RequestMapping(value = "test", method = RequestMethod.GET)
    public String test(){
//        实际返回的是views/test.jsp ,spring-mvc.xml中配置过前后缀
//       Scanner scanner=new Scanner(System.in);
//       logger.info("请输入第一个数字：");
//       String fisrt=scanner.nextLine();
//        Scanner scanner1=new Scanner(System.in);
//        logger.info("请输入第二个数字：");
//        String second=scanner.nextLine();
//        Integer num=testService.returnString(fisrt,second);
//        logger.info("两数之和为："+num);
//        try{
//            Person person=new Person();
//            person.setUsername("杨浩博");
//            person.setPhone("110");
//            person.setRemark("百花村村花");
//            testService.saveInfo(person);
//           List<Person> person1= testService.queryInfoBySql();
//           for(Person personOne:person1){
//           logger.info(personOne.getUsername()+"家地址_____"+personOne.getAddress());
//           }
//        }catch(Exception e){
//            e.printStackTrace();
//        }
        return "/views/text";
    }
    @RequestMapping(value = "/submitName",method = RequestMethod.GET)
    @ResponseBody
    public void submitName(
            @RequestParam(value = "submitArea",defaultValue = "")String submitArea,
            HttpServletResponse response,
            HttpServletRequest request
    ) {
        JSONObject jsonObject=new JSONObject();
        JSONArray jsonArray=new JSONArray();
        String tips="";
        StringBuffer callbacks=new StringBuffer();
        try {
            List<Person> person1 = testService.findAll();
            if (!person1.isEmpty()) {
                for (int i = 0; i < person1.size(); i++) {
                    if (person1.get(i).getAddress() != null && person1.get(i).getAddress() != "") {
                        callbacks.append(submitArea + "家地址为：" + person1.get(i).getAddress()+",");
                        callbacks.append("电话为：" + person1.get(i).getPhone()+",");
                        callbacks.append("又被称为：" + person1.get(i).getRemark()+",");
                        callbacks.append("总之她就是这条街最靓的仔！");
                        jsonArray.add(callbacks);
                    }
                }
                tips = "success:找到这位配佩奇的信息了";
            }else{
                tips = "failed:找不到这位佩奇的信息";
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("出错");
            tips = "failed:找不到这位佩奇的信息";
        }
        jsonObject.put("result", tips);
        jsonObject.put("callback", jsonArray);
        writer(response, jsonObject);
    }
    public void writer(HttpServletResponse response,Object object){
        PrintWriter printWriter = null;
        try {
            response.setCharacterEncoding("UTF-8");
            printWriter=response.getWriter();
            printWriter.print(object);
        } catch (IOException e) {
            logger.error("IO操作异常");
        } finally {
            if (printWriter!=null) {
                printWriter.close();
            }
        }
    }
    @RequestMapping(value="saveTest",method=RequestMethod.GET)
    public void saveTest(){
        try{
            transactionalService.saveTest();
        }catch (Exception e){
//            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            e.printStackTrace();
            logger.error("出错了");
        }
    }
    @RequestMapping(value = "loveJump",method = RequestMethod.GET)
    public String  loveJump(){
        return "/views/ConfessionLove";
    }

    @RequestMapping(value = "WebSocketTest",method = RequestMethod.GET)
    public String  WebSocketTest(HttpServletRequest request,
                                 HttpServletResponse response,@Valid Model model){
//        request.getSession().setAttribute("account",versionStr);
        return "/views/WebSocketTest";
    }

    @ResponseBody
    @RequestMapping(value = "JPAtest", produces = "text/html;charset=UTF-8",method = RequestMethod.GET)
    public String  JPAtest(){
        String a="";
        Person person= testService.findByAddress();
        List<Person> person1= testDao.findAllByMyDedefied();
        return person1.get(0).getAddress()+"我是返回的地址";
    }

    @RequestMapping(value = "jsonTest", produces = "application/json;charset=UTF-8",method = RequestMethod.GET)
    public String  jsonTest(HttpServletResponse response){
        JSONObject jsonObject=new JSONObject();
        jsonObject.put("住址","三街坊");
        jsonObject.put("谁最帅","刘帆");
        response.setContentType("application/json;charset=UTF-8");
        try {
            PrintWriter writer=response.getWriter();
            writer.print(jsonObject);
            writer.flush();
        }catch (Exception e)
        {
            e.printStackTrace();
        }
        return null;
    }

}


