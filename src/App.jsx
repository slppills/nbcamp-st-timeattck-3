import { useQuery, useQueryClient } from "@tanstack/react-query";
import "./App.css";
import axios from "axios";
import { useEffect } from "react";

function App() {
  const queryClient = useQueryClient();

  const getProfiles = async () => {
    const response = await axios.get("http://localhost:5000/profile");
    return response.data;
  };

  const getPosts = async () => {
    const response = await axios.get("http://localhost:5000/posts");
    return response.data;
  };

  const getComments = async (id) => {
    const response = await axios.get(`http://localhost:5000/comments/${id}`);
    return response.data;
  };

  const {
    data: profiles,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfiles(),
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  const { data: comments, refetch } = useQuery({
    queryKey: ["comment"],
    queryFn: ({ queryKey }) => {
      console.log(queryKey);
      const [{ postId }] = queryKey;
      return getComments(postId);
    },
    enabled: false,
  });

  useEffect(() => {
    console.log(comments);
  }, [comments]);

  if (isLoading) {
    return <div>로딩중</div>;
  }
  if (isError) {
    return <div>오류</div>;
  }

  return (
    <div>
      {Object.values(profiles).map((profile, index) => {
        return <h1 key={index}>{profile}</h1>;
      })}
      {posts.map((post, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <h1>{post.title}</h1>
          <p>{post.views}</p>
          <button onClick={() => refetch({ queryKey: [{ type: "comment", postId: post.id }] })}>댓글 보기</button>
        </div>
      ))}
    </div>
  );
}

export default App;
