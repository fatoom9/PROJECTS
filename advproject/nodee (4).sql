-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 23, 2023 at 08:32 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodee`
--

-- --------------------------------------------------------

--
-- Table structure for table `connections`
--

CREATE TABLE `connections` (
  `id` int(11) NOT NULL,
  `user_id1` int(11) DEFAULT NULL,
  `user_id2` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `connections`
--

INSERT INTO `connections` (`id`, `user_id1`, `user_id2`) VALUES
(7, 1, 2),
(8, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `environmental_data`
--

CREATE TABLE `environmental_data` (
  `id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `source` varchar(255) DEFAULT NULL,
  `air_quality` float DEFAULT NULL,
  `temperature` float DEFAULT NULL,
  `humidity` float DEFAULT NULL,
  `water_quality` varchar(255) DEFAULT NULL,
  `biodiversity_metrics` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `environmental_data`
--

INSERT INTO `environmental_data` (`id`, `timestamp`, `source`, `air_quality`, `temperature`, `humidity`, `water_quality`, `biodiversity_metrics`, `user_id`) VALUES
(1, '2023-12-22 20:55:29', 'Manual Observation', 0, 27, 55.5, 'Very Clean', 'Very High', 1),
(6, '2023-12-20 10:00:00', 'Manual Observation', 8.5, 27.3, 60, 'Good', 'High', NULL),
(11, '2023-12-20 10:00:00', 'Manual Observation', 8.5, 27.3, 60, 'Good', 'High', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `environmental_reports`
--

CREATE TABLE `environmental_reports` (
  `report_id` int(11) NOT NULL,
  `reporter_id` int(11) DEFAULT NULL,
  `issue_type` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `environmental_reports`
--

INSERT INTO `environmental_reports` (`report_id`, `reporter_id`, `issue_type`, `description`, `location`, `timestamp`) VALUES
(1, 1, 'Deforestation', 'Large-scale deforestation reported in the Amazon rainforest.', 'Amazon', '2023-11-18 17:06:24'),
(2, 3, 'Deforestation', 'Large-scale deforestation reported in the Amazon rainforest.', 'Amazon', '2023-12-22 20:08:38');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `event_date` datetime NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `organizer` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `event_name`, `description`, `event_date`, `location`, `organizer`) VALUES
(1, 'Your Event Name', 'Your Event Description', '2023-11-15 12:00:00', 'Event Location', 'Event Organizer'),
(2, 'social', 'anything', '2023-12-22 12:00:00', 'nablus', 'me'),
(3, 'event to enviroment', 'Your Event Description', '2023-12-23 12:00:00', 'asira', 'Event Organizer');

-- --------------------------------------------------------

--
-- Table structure for table `photos`
--

CREATE TABLE `photos` (
  `id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `photos`
--

INSERT INTO `photos` (`id`, `filename`, `url`, `created_at`) VALUES
(1, '', '/uploads/photo-1703084995539-366278188.jpg', '2023-12-20 13:09:55'),
(2, '', '/uploads/photo-1703085025320-907861607.jpg', '2023-12-20 13:10:25'),
(3, '', '/uploads/photo-1703086373729-515795135.jpg', '2023-12-20 13:32:53'),
(0, '', '/uploads/photo-1703261319858-241966929.jpg', '2023-12-22 16:08:39'),
(0, '', '/uploads/photo-1703281798728-115394447.jpg', '2023-12-22 21:49:58');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `bio` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `contributions` int(11) DEFAULT 0,
  `environmental_interests` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `sustainability_score` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `bio`, `location`, `contributions`, `environmental_interests`, `created_at`, `sustainability_score`) VALUES
(1, 'john_doe', 'housnianahelmashaqi@gmail.com', 'securepassword', 'New bio content', 'New location', 0, 'New interests', '2023-11-17 12:53:43', 730),
(2, 'salma', 'housnianahelmashaqi@gmail.com', 'securepassword', 'Environmental enthusiast', 'City, Country', 0, 'Renewable energy, Conservation', '2023-11-17 13:47:40', 0),
(4, 'testttuser', 'housnianahelmashaqi@gmail.com', '$2b$10$r3e/BAdNOxRk6.zWZp/w3OrRhJJrbXzn3IOizk1PcUpyJ9tnFEHaS', NULL, NULL, 0, NULL, '2023-12-21 19:01:03', 0),
(5, 'john_doe', 'housnianahelmashaqi@gmail.com', 'securepassword', 'Environmental enthusiast', 'City, Country', 0, 'Renewable energy, Conservation', '2023-12-22 16:59:02', 0),
(6, 'john_doe', 'housnianahelmashaqi@gmail.com', 'securepassword', 'Environmental enthusiast', 'City, Country', 0, 'Renewable energy, Conservation', '2023-12-22 17:01:08', 0),
(7, 'housnia', 'housnianahelmashaqi@gmail.com', 'securepassword', 'Environmental enthusiast', 'nablus, palestine', 0, 'Renewable energy, Conservation', '2023-12-22 18:37:06', 0),
(8, 'housnia', 'housnianahelmashaqi@gmail.com', 'securepassword', 'Environmental enthusiast', 'nablus, palestine', 0, 'Renewable energy, Conservation', '2023-12-22 18:53:51', 0),
(9, 'salma', 'housnianahelmashaqi@gmail.com', 'securepassword', 'Environmental enthusiast', 'City, Country', 0, 'Renewable energy, Conservation', '2023-12-22 19:25:07', 0),
(10, 'testttuser', 'housnianahelmashaqi@gmail.com', '$2b$10$JMxL/JUHIpdC3STZaIqXtucPgJqxz6GfQYZ0prb3wIP0klCex.Ww.', NULL, NULL, 0, NULL, '2023-12-22 20:59:07', 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_alerts`
--

CREATE TABLE `user_alerts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `alert_name` varchar(255) DEFAULT NULL,
  `threshold_airQuality` float DEFAULT NULL,
  `threshold_temperature` float DEFAULT NULL,
  `threshold_humidity` float DEFAULT NULL,
  `threshold_waterQuality` varchar(50) DEFAULT NULL,
  `threshold_biodiversityMetrics` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_alerts`
--

INSERT INTO `user_alerts` (`id`, `user_id`, `alert_name`, `threshold_airQuality`, `threshold_temperature`, `threshold_humidity`, `threshold_waterQuality`, `threshold_biodiversityMetrics`) VALUES
(1, 1, 'any', 50, 25, 99, 'Good', 'High'),
(9, 2, 'any', 70, 30, 90, 'Good', 'High'),
(11, 2, 'any', 70, 30, 90, 'Good', 'High');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `connections`
--
ALTER TABLE `connections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id1` (`user_id1`),
  ADD KEY `user_id2` (`user_id2`);

--
-- Indexes for table `environmental_data`
--
ALTER TABLE `environmental_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `environmental_reports`
--
ALTER TABLE `environmental_reports`
  ADD PRIMARY KEY (`report_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_alerts`
--
ALTER TABLE `user_alerts`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `connections`
--
ALTER TABLE `connections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `environmental_data`
--
ALTER TABLE `environmental_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `environmental_reports`
--
ALTER TABLE `environmental_reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user_alerts`
--
ALTER TABLE `user_alerts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `connections`
--
ALTER TABLE `connections`
  ADD CONSTRAINT `connections_ibfk_1` FOREIGN KEY (`user_id1`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `connections_ibfk_2` FOREIGN KEY (`user_id2`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
