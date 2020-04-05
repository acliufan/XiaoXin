package com.webSocket.version_02_Account;
/**
 * Created by Administrator on 2019/7/3 0003.
 */
import com.webSocket.version_02_Account.AdminAndUsers;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import javax.annotation.Resource;
import java.io.IOException;
@Controller
@RequestMapping("/")
public class SendTest {

    @Resource
    AdminAndUsers webSocketServer;


    @RequestMapping("/send")
    public void send() {
        try {
            webSocketServer.sendToUser("普通用户信息，管理员收得到 ", "1");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping("/send2")
    public void send2() {
        try {
            webSocketServer.sendToUser("管理员专属信息 ", "2");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}

