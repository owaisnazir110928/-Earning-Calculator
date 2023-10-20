import React, { useEffect, useState } from "react";
import styles from "./Style/Earning.module.css";
import viewSvg from "../assets/views.svg";
import likeSvg from "../assets/likes.svg";
import commentSvg from "../assets/comments.svg";
import { useParams } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";

const API_KEY = "AIzaSyAwWGDBtulgkwYaUZqXM4puMowDbDacWuY";
const Earning = () => {
  const { url } = useParams();
  const [loading, setLoading] = useState(0);
  const [videoData, setVideoData] = useState({
    views: 0,
    likes: 0,
    comments: 0,
    subs: 0,
    earnings: 0,
    imgUrl: "",
    title: "",
    date: new Date(),
  });
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  const fetchVideoStatistics = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${url}&key=${API_KEY}&part=snippet,statistics`
      );
      if (response.ok) {
        const data = await response.json();
        const videoStats = data.items[0].statistics;
        const channelData = data.items[0].snippet;
        const utcDate = new Date(channelData.publishedAt);
        const formattedDate = utcDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const channelId = channelData.channelId;
        const imgUrl = channelData.thumbnails.maxres.url;
        const title = channelData.title;

        setVideoData({
          views: videoStats.viewCount,
          likes: videoStats.likeCount,
          comments: videoStats.commentCount,
          subs: 0,
          earnings: 0,
          imgUrl,
          title,
          date: formattedDate,
        });

        fetchSubscriberCount(channelId);
        fetchPopularVideos(channelId);
      } else if (response.status === 403) {
        throw new Error("API Limit Exceeded. Please try again later.");
      } else {
        throw new Error("Error fetching video details");
      }
    } catch (error) {
      console.error("Error fetching video details:", error);
      setLoading(100);
      setError(error.message);
    }
  };

  const fetchSubscriberCount = async (channelId) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&key=${API_KEY}&part=statistics,snippet&order=viewCount&maxResults=10`
      );
      if (response.ok) {
        const data = await response.json();
        const subscriberCount = data.items[0].statistics.subscriberCount;
        setVideoData((prevData) => ({
          ...prevData,
          subs: subscriberCount,
          earnings:
            Math.min(subscriberCount, prevData.views) +
            10 * prevData.comments +
            5 * prevData.likes,
        }));
        setLoading(100);
      } else {
        throw new Error("Error fetching subscriber count");
      }
    } catch (error) {
      console.error("Error fetching subscriber count:", error);
      setLoading(100);
    }
  };

  const fetchPopularVideos = async (channelId) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=viewCount&maxResults=10`
      );
      if (response.ok) {
        const data = await response.json();
        const videoPromises = data.items.map(async (video) => {
          const videoId = video.id.videoId;
          const statistics = await fetchVideoStatisticsPopular(videoId);
          const date2 = new Date(video.snippet.publishedAt);

          return {
            title: video.snippet.title,
            views: statistics.viewCount,
            likes: statistics.likeCount,
            date: date2.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            comments: statistics.commentCount,
            imgUrl: video.snippet.thumbnails.high.url,
            earnings:
              Math.min(statistics.viewCount) +
              10 * statistics.commentCount +
              5 * statistics.likeCount,
          };
        });
        const videosData = await Promise.all(videoPromises);
        const sortedVideos = videosData.sort((a, b) => b.earnings - a.earnings);
        setVideos(sortedVideos);
      } else {
        throw new Error("Error fetching popular videos");
      }
    } catch (error) {
      console.error("Error fetching popular videos:", error);
    }
  };

  async function fetchVideoStatisticsPopular(videoId) {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoId}&part=statistics`
    );
    const data = await response.json();
    return data.items[0].statistics;
  }

  useEffect(() => {
    fetchVideoStatistics();
  }, [url]);

  if (loading < 100) {
    return (
      <center className={styles.center}>
        <CirclesWithBar
          height="100"
          width="100"
          color="#4fa94d"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          outerCircleColor=""
          innerCircleColor=""
          barColor=""
          ariaLabel="circles-with-bar-loading"
        />
      </center>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h2>An error occurred:</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.container}>
        <div className={styles.upperPart}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.img}>
                <img
                  width="256"
                  height="144"
                  src={videoData.imgUrl}
                  alt="Video Thumbnail"
                />
                <p>Uploaded on - {videoData.date}</p>
              </div>
              <div className={styles.details}>
                <p className={styles.title}>{videoData.title}</p>
                <p className={styles.stats}>
                  <img src={viewSvg} alt="Views Icon" />
                  <span>{videoData.views}</span>
                </p>
                <p className={styles.stats}>
                  <img src={likeSvg} alt="Likes Icon" />
                  <span>{videoData.likes}</span>
                </p>
                <p className={styles.stats}>
                  <img src={commentSvg} alt="Comments Icon" />
                  <span>{videoData.comments}</span>
                </p>
              </div>
            </div>
            <div className={styles.headerRight}>
              <span>₹{videoData.earnings.toLocaleString("en-IN")}</span>
              <button className={styles.button}>Check How?</button>
            </div>
          </div>
        </div>
        <div className={styles.belowPart}>
          <h3>Other Videos Potentials</h3>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHead}>
                  <th className={styles.rank}>Rank</th>
                  <th className={styles.videoTitle}>Title</th>
                  <th className={styles.midThumb}>Thumbnail</th>
                  <th className={styles.videoViews}>Views</th>
                  <th className={styles.videoLikes}>Likes</th>
                  <th className={styles.videoComments}>Comment</th>
                  <th className={styles.videoDate}>Uploaded on</th>
                  <th className={styles.estimation}>*Estimated Earning</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video, index) => (
                  <tr className={styles.tableBody} key={index}>
                    <td className={styles.rank}>{index + 1}</td>
                    <td className={styles.videoTitle}>{video.title}</td>

                    <td className={styles.midThumb}>
                      <img
                        width="130px"
                        height="73.3px"
                        src={video.imgUrl}
                        className={styles.midThumb}
                      />
                    </td>
                    <td className={styles.videoViews}>{video.views}</td>
                    <td className={styles.videoLikes}>{video.likes}</td>
                    <td className={styles.videoComments}>{video.comments}</td>
                    <td className={styles.videoDate}>{video.date}</td>
                    <td className={styles.estimation}>
                      ₹{video.earnings.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earning;
