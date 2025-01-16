const firebaseConfig = {
  apiKey: "AIzaSyD_AccsF9-66iuqtWP84KbKeL3Ev7tu3Wg",
  authDomain: "social-media-blog-project.firebaseapp.com",
  projectId: "social-media-blog-project",
  storageBucket: "social-media-blog-project.firebasestorage.app",
  messagingSenderId: "1085010794685",
  appId: "1:1085010794685:web:20d82e5a0d440774e37fd4",
  measurementId: "G-8VXZ15S57Y"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to render posts
const renderPosts = (posts) => {
  const postList = document.getElementById("post-list");
  postList.innerHTML = ""; 

  posts.forEach((doc) => {
    const post = doc.data();
    const postCard = document.createElement("div");
    postCard.classList.add("post-card");
    postCard.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <p><em>By: ${post.author}</em></p>
      <div class="emoji-container">
        ${Object.entries(post.emojis)
          .map(
            ([emoji, count]) =>
              `<span class="emoji" data-id="${doc.id}" data-emoji="${emoji}">${emoji} ${count}</span>`
          )
          .join(" ")}
      </div>
    `;
    postList.appendChild(postCard);
  });

  
  document.querySelectorAll(".emoji").forEach((emojiSpan) => {
    emojiSpan.addEventListener("click", async (e) => {
      const postId = e.target.dataset.id;
      const emoji = e.target.dataset.emoji;
      const postRef = db.collection("posts").doc(postId);
      const postDoc = await postRef.get();
      const emojis = postDoc.data().emojis;
      emojis[emoji] += 1;
      await postRef.update({ emojis });
    });
  });
};


db.collection("posts")
  .orderBy("date", "desc") /
  .onSnapshot((snapshot) => {
    const posts = snapshot.docs;
    renderPosts(posts);
  });

/
document.getElementById("post-button").addEventListener("click", async () => {
  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content").value.trim();
  const author = document.getElementById("post-author").value.trim();

  if (!title || !content || !author) {
    alert("All fields are required!");
    return;
  }

  try {
    await db.collection("posts").add({
      title,
      content,
      author,
      date: new Date(),
      emojis: { "👍": 0, "❤️": 0, "😲": 0 },
    });
    document.getElementById("post-title").value = "";
    document.getElementById("post-content").value = "";
    document.getElementById("post-author").value = "";
  } catch (error) {
    console.error("Error adding post:", error);
    alert("Failed to add post. Check the console for details.");
  }
});
