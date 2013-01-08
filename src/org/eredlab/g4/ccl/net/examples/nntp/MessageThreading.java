/*
 * Copyright 2001-2005 The Apache Software Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.eredlab.g4.ccl.net.examples.nntp;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.SocketException;

import org.apache.log4j.Logger;
import org.eredlab.g4.ccl.net.examples.PrintCommandListener;
import org.eredlab.g4.ccl.net.nntp.Article;
import org.eredlab.g4.ccl.net.nntp.NNTPClient;
import org.eredlab.g4.ccl.net.nntp.NewsgroupInfo;
import org.eredlab.g4.ccl.net.nntp.Threader;

public class MessageThreading {
   private static Logger logger = Logger.getLogger(MessageThreading.class);
	public MessageThreading() {
	}
	
	public static void main(String[] args) throws SocketException, IOException {
		
		if (args.length != 3)
			usage();
		
		String hostname = args[0];
		String user = args[1];
		String password = args[2];
		
		NNTPClient client = new NNTPClient();
		client.addProtocolCommandListener(new PrintCommandListener(new PrintWriter(System.out)));
		client.connect(hostname);
		
		if(!client.authenticate(user, password)) {
//			System.out.println("Authentication failed for user " + user + "!");
		   String aString = "Authentication failed for user " + user + "!";
		   logger.info(aString);
			System.exit(1);
		}
		
		NewsgroupInfo group = new NewsgroupInfo();
		client.selectNewsgroup("comp.lang.lisp", group);
		
		int lowArticleNumber = group.getFirstArticle();
		int highArticleNumber = lowArticleNumber + 100;
		
		String bString = "Retrieving articles between [" + lowArticleNumber + "] and [" + highArticleNumber + "]";
		logger.info(bString);
//		System.out.println("Retrieving articles between [" + lowArticleNumber + "] and [" + highArticleNumber + "]");
		Article[] articles = NNTPUtils.getArticleInfo(client, lowArticleNumber, highArticleNumber);
		
		String cString = "Building message thread tree...";
		logger.info(cString);
//		System.out.println("Building message thread tree...");
		Threader threader = new Threader();
		Article root = (Article)threader.thread(articles);
		
		Article.printThread(root, 0);	
		
	}
	
	
	public static void usage() {
//		System.out.println("Usage: MessageThreading <hostname> <user> <password>");
		System.exit(0);
	}
}
