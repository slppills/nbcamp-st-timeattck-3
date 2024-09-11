import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./App.css";
import axios from "axios";
import { useState } from "react";

function App() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [views, setViews] = useState(0);

  const getPosts = async () => {
    const response = await axios.get("http://localhost:5000/posts");
    return response.data;
  };

  const updatePosts = async (formData) => {
    const response = await axios.post("http://localhost:5000/posts", formData);
    return response.data;
  };

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  const { mutate } = useMutation({
    mutationFn: updatePosts,
    onSuccess: () => {
      alert("등록 완료");
      queryClient.invalidateQueries(["posts"]);
    },
  });

  if (isLoading) {
    return <div>로딩중</div>;
  }
  if (isError) {
    return <div>에러 발생</div>;
  }
  if (posts) {
    console.log(posts);
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate({ title, views });
        }}
      >
        <input type="text" placeholder="title 입력" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="number" placeholder="views 입력" value={views} onChange={(e) => setViews(e.target.value)} />
        <button type="submit">입력</button>
      </form>
      {posts.map((post, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <h1>{post.title}</h1>
          <p>{post.views}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
