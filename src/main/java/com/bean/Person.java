package com.bean;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * Created by Administrator on 2019/2/3 0003.
 */
@Data
@Entity
@Table(name="person")
public class Person {
    @Id
    @Column(name="ID")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator" )
    @GeneratedValue(generator = "uuid")
    private String id;
    //    @GenericGenerator(name = "uuid", strategy = "native" )
     /*主键生成策略*/

    @Column(name = "created")
    private Long created = System.currentTimeMillis();

    @Column(name = "username")
    private String username;

    @Column(name = "address")
    private String address;

    @Column(name = "phone")
    private String phone;

    @Column(name = "remark")
    private String remark;

    @Column(name = "lastname")
    private String lastname;

//    public String getId() {
//        return id;
//    }
//
//    public void setId(String id) {
//        this.id = id;
//    }
//
//    public Long getCreated() {
//        return created;
//    }
//
//    public void setCreated(Long created) {
//        this.created = created;
//    }
//
//    public String getUsername() {
//        return username;
//    }
//
//    public void setUsername(String username) {
//        this.username = username;
//    }
//
//    public String getAddress() {
//        return address;
//    }
//
//    public void setAddress(String address) {
//        this.address = address;
//    }
//
//    public String getPhone() {
//        return phone;
//    }
//
//    public void setPhone(String phone) {
//        this.phone = phone;
//    }
//
//    public String getRemark() {
//        return remark;
//    }
//
//    public void setRemark(String remark) {
//        this.remark = remark;
//    }
}
