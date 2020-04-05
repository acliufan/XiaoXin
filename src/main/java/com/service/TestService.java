package com.service;

import com.bean.Person;
import com.bean.UserInfo;
import com.bean.QPerson;
import com.dao.TestDao;
import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jdbc.query.QueryDslJdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
/**
 * Created by Administrator on 2019/1/31 0031.
 */
@Service
@Transactional
public class TestService {
    @Autowired
    private TestDao testDao ;//自动注入,可以直接使用的testDao来调用TestDao的方法，拿来即用
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private QueryDslJdbcTemplate queryDslJdbcTemplate;
    private QPerson $ = QPerson.person;
    private static final Logger logger = LoggerFactory.getLogger(TestService.class);
  /*  是把Spring里面的bean的配置也给去掉，
     使得spring配置文件里面只有一个自动扫描的标签，
    增强Java代码的内聚性并进一步减少配置文件。*/
    public Integer returnString(String a, String b) {
        Integer firstNum = 0;
        Integer secondNum = 0;
        try {
            firstNum = Integer.parseInt(a);
            secondNum = Integer.parseInt(b);
        } catch (Exception e) {
            e.printStackTrace();
            logger.info("请输入数字类型的数字！");
        }
        return firstNum + secondNum;
    }
    public String saveInfo(Person person){
        String returnWords="";
        try{
            testDao.save(person);
            returnWords="保存成功";
        }catch(Exception e){
            e.printStackTrace();
            returnWords="保存失败";
        }
       return returnWords;
    }
    public List<Person> queryInfo(String submitArea){
        BooleanBuilder condition = new BooleanBuilder();
        condition.and($.username.eq(submitArea));
        return Lists.newArrayList(testDao.findAll(condition));
    }
    public List<UserInfo> queryInfoBySql(String submitArea){
        String sql="SELECT\n" +
                "\tperson.id AS id,\n" +
                "\tperson.username AS username,\n" +
                "\tperson.address AS address,\n" +
                "\tperson.remark AS remark,\n" +
                "\tperson.phone AS phone,\n" +
                "\tperson.created AS created\n" +
                "FROM\n" +
                "\tperson where username=\'"+submitArea+"\'";
        jdbcTemplate = (JdbcTemplate) queryDslJdbcTemplate.getJdbcOperations();
        List<UserInfo> lists = jdbcTemplate.query(sql, new Object[]{}, new BeanPropertyRowMapper<UserInfo>(UserInfo.class));
        if(org.springframework.util.CollectionUtils.isEmpty(lists)){
            return  Lists.newArrayList();
        }
        return lists;
    }
    public List<Person> queryPersonBySql(String submitArea){
        String sql="select * from person where username=\'"+submitArea+"\'";
        jdbcTemplate = (JdbcTemplate) queryDslJdbcTemplate.getJdbcOperations();
        List<Person> lists = jdbcTemplate.query(sql, new Object[]{}, new BeanPropertyRowMapper<Person>(Person.class));
        return lists;
    }
   public Person findByAddress(){
        Person person=new Person();
        String address="百花村";
        person=testDao.findPeopleByAddressEquals(address);
        return person;
    }
    public List<Person> findAll() {
        return Lists.newArrayList(testDao.findAll());
    }
}
