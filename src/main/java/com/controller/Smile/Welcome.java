package com.controller.Smile;


import com.bean.Person;
import com.service.TestService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

/**
 * Created by Administrator on 2019/9/14 0014.
 */
@Controller
public class Welcome {
    private static final Logger logger = LoggerFactory.getLogger(Welcome.class);
    @Autowired
    private TestService testService;

    @RequestMapping(value = "SmileJump")
    public String SmileJump() {
        return "SmallSmile/SmileJump";
    }
    @RequestMapping(value = "ToLogin")
    public String ToLogin() {
        return "SmallSmile/Login";
    }
    @RequestMapping(value = "ToSmileMain")
    public String ToSmileMain( Model model,@RequestParam(value = "userName", defaultValue = "") String name)

    {
        model.addAttribute("userName", name);
        return "SmallSmile/SmileMain";
    }
//    @RequestMapping(value = "ToXinChat")
//    public String ToSmileChat( Model model,@RequestParam(value = "userName", defaultValue = "") String name)
//
//    {
//        model.addAttribute("userName", name);
//        return "SmallSmile/SmileWebSocket";
//    }
    @RequestMapping(value = "ToXinChat")
    public String ToSmileChat( Model model,@RequestParam(value = "userName", defaultValue = "") String name)

    {
        model.addAttribute("userName", name);
        return "SmallSmile/home";
    }
    @RequestMapping(value = "/SmileSubmit",method = RequestMethod.GET)
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
//            List<Person> person2 = testService.queryInfo(submitArea);
//            List<Person> person3 = testService.queryPersonBySql(submitArea);
            if(person1.get(0).getUsername().equals(submitArea)){
                for (int i = 0; i < person1.size(); i++) {
                    if (person1.get(i).getAddress() != null && person1.get(i).getAddress() != "") {
//                        callbacks.append("最靓的那一个"+"<span style=\"color:deeppink\">"+submitArea +"</span>"+ "坐标：" + person1.get(i).getAddress()+",");
                        callbacks.append("最靓的那一个"+submitArea +"坐标：" + person1.get(i).getAddress()+",");
                        callbacks.append("江湖人称：" + person1.get(i).getRemark()+",");
                        callbacks.append("电话为：" + person1.get(i).getPhone()+",");
                        callbacks.append("又被称为：" + person1.get(i).getLastname()+"!");
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
            logger.error("IO操作异常了");
        } finally {
            if (printWriter!=null) {
                printWriter.close();
            }
        }
    }
//    @RequestMapping(value="UserLogin")
//    public void UserLogin(
//            @RequestParam(value = "userName",defaultValue = "")String userName,
//            Model model,
//            HttpSession session,
//            HttpServletResponse response,
//            HttpServletRequest request
//    ){
//        JSONObject tips=new JSONObject();
//        if(userName.isEmpty()){
//            tips.put("result","failed:what?你想空手套白狼？！！");
//        }else if(!userName.isEmpty()&&"信昕".equals(userName)){
//            tips.put("result","failed:想想是不是少了个啥？");
//        }else if(!userName.isEmpty()&&"信佳昕".equals(userName)){
//            tips.put("result","success:欢迎进入Xin Chat！");
//            session.setAttribute("CurrentUser",userName);
//        }else if(!userName.isEmpty()&&"小刘".equals(userName)){
//            tips.put("result","success:欢迎进入Xin Chat！");
//            session.setAttribute("CurrentUser",userName);
//        }
//        else{
//            tips.put("result","failed:给你一秒钟的时间重新思考！");
//        }
//        writer(response, tips);
//        return;
//    }
}
