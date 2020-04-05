package com.service;

import com.bean.Person;
import com.dao.TestDao;
import com.google.common.collect.Lists;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jdbc.query.QueryDslJdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.util.List;

/**
 * Created by Administrator on 2019/2/9 0009.
 */
@Service
@Transactional
public class TransactionalService {
    @Autowired
    JdbcTemplate jdbcTemplate;
    @Autowired
    QueryDslJdbcTemplate queryDslJdbcTemplate;
    @Autowired
    TestDao testDao;
    private static Logger logger=Logger.getLogger("TransactionalService.class");
    public void saveTest(){
        Person person=new Person();
        person.setUsername("刘凡凡");
        testDao.save(person);
        logger.info("保存成功");
        int i=1/0;
    }
}
