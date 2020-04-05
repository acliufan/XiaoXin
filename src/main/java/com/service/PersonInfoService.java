package com.service;

import com.bean.QPerson;
import com.bean.QUserInfo;
import com.dao.UserInfoDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jdbc.query.QueryDslJdbcTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by Administrator on 2019/9/29 0029.
 */
@Service
@Transactional
public class PersonInfoService {
    @Autowired
    private UserInfoDao userInfoDao ;//自动注入,可以直接使用的testDao来调用TestDao的方法，拿来即用
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private QueryDslJdbcTemplate queryDslJdbcTemplate;
    private QUserInfo $ = QUserInfo.userInfo;
    private static final Logger logger = LoggerFactory.getLogger(TestService.class);
  /*  是把Spring里面的bean的配置也给去掉，
     使得spring配置文件里面只有一个自动扫描的标签，
    增强Java代码的内聚性并进一步减少配置文件。*/

}
