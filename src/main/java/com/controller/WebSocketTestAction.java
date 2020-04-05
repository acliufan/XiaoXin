package com.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by Administrator on 2019/7/4 0004.
 */
@Controller
public class WebSocketTestAction {
    @RequestMapping("singleChat")
    public String page2(HttpServletRequest request,
                        HttpServletResponse response,
                        Model model,
                        @RequestParam(value = "name",defaultValue = "") String name){
        model.addAttribute("name",name);
        return "WebSocketTest";
    }
}
