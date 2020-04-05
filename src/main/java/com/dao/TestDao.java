package com.dao;
import com.bean.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Administrator on 2019/2/3 0003.
 */
public interface TestDao extends JpaRepository<Person,String>,JpaSpecificationExecutor<Person>,QueryDslPredicateExecutor<Person>
{
    /*
    JPA使用
    1、继承JpaRepository，满足基本的CURD方法查询
    2、定义查询方法，findBy**,getBy**
    3、声明自定义查询方法，采用@Query实现
    */
//      定义查询方法，findBy**,getBy**
    Person findPeopleByAddressEquals(String address);
//     声明自定义查询方法，采用@Query实现
    @Query("select u from Person u where u.username='杨浩博'")
    List<Person> findAllByMyDedefied();
}
