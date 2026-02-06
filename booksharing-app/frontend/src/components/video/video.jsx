import { useEffect, useState } from "react";
import { videoService } from '../../api/bookService';
import  Loading  from '../../components/layout/Loading';
import './video.css';

const PromotionalVideo = () => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await videoService.getActiveVideo();
        if (response.data.length > 0) {
          setVideo(response.data[0]);
        }
      } catch (err) {
        console.error('error fetching video:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, []);

  if (loading) return <Loading />;
  if (!video) return null;

  return (
    <div className="promotional-video-section">
      <h2>{video.title}</h2>
      {video.description && <p>{video.description}</p>}
      <video
        controls
        className="promotional-video"
        src={video.video_url}
      >
        Your browser does not support the video tag
      </video>
    </div>
  );

};

export default PromotionalVideo;
