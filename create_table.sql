 CREATE TABLE `roles` (
  `roleid` int(11) NOT NULL,
  `rolename` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`roleid`)
);
 CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `roleid` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_role` (`roleid`),
  CONSTRAINT `fk_role` FOREIGN KEY (`roleid`) REFERENCES `roles` (`roleid`)
);