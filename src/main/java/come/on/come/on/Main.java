package come.on.come.on;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;

public class Main {

    public static void main(String[] args) {

        Server server = new Server();

        ServerConnector http = new ServerConnector(server);
        http.setHost("localhost");
        http.setPort(8080);
        server.addConnector(http);

        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");

        ResourceHandler resourceHandler = new ResourceHandler();
        resourceHandler.setResourceBase("src/main/resources/webapp");

        context.setHandler(resourceHandler);

        server.setHandler(context);

        try {
            server.start();
            server.dumpStdErr();
            server.join();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
