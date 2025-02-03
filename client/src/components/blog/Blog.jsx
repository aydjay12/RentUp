import React from "react";
import Back from "../common/Back";
import RecentCard from "../home/recent/RecentCard";
import "../home/recent/recent.css";
import img from "../images/about.jpg";
import { motion } from "framer-motion";

const Blog = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -1000 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -1000 }}
    >
      <section className="blog-out mb">
        <Back name="Blog" title="Blog Grid - Our Blogs" cover={img} />
        <div className="container recent">
          <RecentCard />
        </div>
      </section>
    </motion.div>
  );
};

export default Blog;
