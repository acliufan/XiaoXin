package com.dao;

import com.bean.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;

/**
 * Created by Administrator on 2019/9/29 0029.
 */
public interface UserInfoDao extends JpaRepository<UserInfo,String>,JpaSpecificationExecutor<UserInfo>,QueryDslPredicateExecutor<UserInfo>
{
}
