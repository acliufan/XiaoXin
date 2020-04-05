package com.webSocket.version_01_sessionMap;

import javax.servlet.http.HttpSession;
import javax.websocket.HandshakeResponse;
import javax.websocket.server.HandshakeRequest;
import javax.websocket.server.ServerEndpointConfig;
import javax.websocket.server.ServerEndpointConfig.Configurator;

/**
 * Created by ht706 on 2019/7/3.
 */
public class HttpSessionConfigurator extends Configurator {

    public void modifyHandshake(ServerEndpointConfig sec, HandshakeRequest request, HandshakeResponse response){
        HttpSession httpSession=(HttpSession)request.getHttpSession();
        if(httpSession!=null){
            sec.getUserProperties().put(HttpSession.class.getName(),httpSession);
        }
    }
}
