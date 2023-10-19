import React, { useEffect, useState } from "react";
import styles from "./Style/Earning.module.css";
import viewSvg from "../assets/views.svg";
import likeSvg from "../assets/likes.svg";
import commentSvg from "../assets/comments.svg";
import { useParams } from "react-router-dom";

const API_KEY = "AIzaSyBGlfANrVugCzArdOMphZvr1hcp7WyVSj4";

const Earning = () => {
  const { url } = useParams();
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [subs, setSubs] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(0);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [videos, setVideos] = useState([]);
  const [channelId, setChannelId] = useState("");

  const fetchVideoStatistics = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${url}&key=${API_KEY}&part=snippet,statistics`
      );
      if (response.ok) {
        const data = await response.json();
        const videoStats = data.items[0].statistics;
        setImgUrl(data.items[0].snippet.thumbnails.maxres.url);
        setTitle(data.items[0].snippet.title);
        const utcDate = new Date(data.items[0].snippet.publishedAt);
        var options = { year: "numeric", month: "short", day: "numeric" };
        setDate(utcDate.toLocaleDateString("en-US", options));
        setChannelId(data.items[0].snippet.channelId); // Set the channelId here
        return {
          viewCount: videoStats.viewCount,
          likeCount: videoStats.likeCount,
          commentCount: videoStats.commentCount,
          channelId: data.items[0].snippet.channelId,
        };
      } else {
        throw new Error("Error fetching video details");
      }
    } catch (error) {
      throw new Error("Error fetching video details");
    }
  };

  async function fetchVideoStatisticsPopular(videoId) {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoId}&part=statistics`
    );
    const data = await response.json();
    return data.items[0].statistics;
  }

  const fetchSubscriberCount = async (channelId) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&key=${API_KEY}&part=statistics,snippet&order=viewCount&maxResults=10`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return {
          subscriberCount: data.items[0].statistics.subscriberCount,
        };
      } else {
        throw new Error("Error fetching subscriber count");
      }
    } catch (error) {
      throw new Error("Error fetching subscriber count");
    }
  };

  async function fetchPopularVideos() {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=viewCount&maxResults=10`
    );
    const data = await response.json();

    const videoPromises = data.items.map(async (video) => {
      const videoId = video.id.videoId;
      const statistics = await fetchVideoStatisticsPopular(videoId);
      return {
        title: video.snippet.title,
        views: statistics.viewCount,
        likes: statistics.likeCount,
        dislikes: statistics.dislikeCount,
        comments: statistics.commentCount,
        earnings:
          Math.min(statistics.viewCount) +
          10 * statistics.commentCount +
          5 * statistics.likeCount,
      };
    });

    const videosData = await Promise.all(videoPromises);

    const sortedVideos = videosData.sort((a, b) => b.earnings - a.earnings);

    return sortedVideos;
  }
  useEffect(() => {
    console.log(url);
    const fetchData = async () => {
      try {
        setLoading(30);
        const videoStatistics = await fetchVideoStatistics();
        setViews(videoStatistics.viewCount);
        setLikes(videoStatistics.likeCount);
        setComments(videoStatistics.commentCount);
        setLoading(50);
        const subscriberData = await fetchSubscriberCount(
          videoStatistics.channelId
        );
        setSubs(subscriberData.subscriberCount);
        setLoading(70);
        const countEarnings =
          Math.min(subscriberData.subscriberCount, videoStatistics.viewCount) +
          10 * videoStatistics.commentCount +
          5 * videoStatistics.likeCount;
        setEarnings(countEarnings);
        setLoading(100);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(100);
      }
    };

    fetchData();
  }, [url, channelId]);

  useEffect(() => {
    async function fetchVideosData() {
      if (channelId) {
        const videoData = await fetchPopularVideos();
        setVideos(videoData);
      }
    }

    fetchVideosData();
  }, [channelId]);

  if (loading < 100) {
    return (
      <center>
        <h2>Loading... {loading}</h2>
      </center>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.upperPart}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.img}>
              <img width="256" height="144" src={imgUrl} />
              <p>Uploaded on - {date}</p>
            </div>
            <div className={styles.details}>
              <p className={styles.title}>{title}</p>
              <p className={styles.stats}>
                <img src={viewSvg} />
                <span>{views}</span>
              </p>
              <p className={styles.stats}>
                <img src={likeSvg} />
                <span>{likes}</span>
              </p>
              <p className={styles.stats}>
                <img src={commentSvg} />
                <span>{comments}</span>
              </p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <span>₹{earnings.toLocaleString("en-IN")}</span>
            <button className={styles.button}>Check How?</button>
          </div>
        </div>
      </div>
      <div className={styles.belowPart}>
        <h3>Other Videos Potentials</h3>
      </div>
      <h1>Popular Videos and Statistics</h1>
      <div className="videos-container">
        {videos.map((video, index) => (
          <div key={index} className="video-card">
            <h2>{video.title}</h2>
            <p>Views: {video.views}</p>
            <p>Likes: {video.likes}</p>
            <p>Dislikes: {video.dislikes}</p>
            <p>Comments: {video.comments}</p>
            <p>
              Earning:{" "}
              {Math.min(video.views) + 10 * video.comments + 5 * video.likes}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Earning;
