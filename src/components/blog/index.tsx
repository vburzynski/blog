import React from 'react';

import BlogAuthor from './blog-author';
import BlogHeader from './blog-header';
import BlogNavigation from './blog-navigation';
import BlogTags from './blog-tags';
import BlogContent from './blog-content';
import BlogCard from './blog-card';

function Blog({ children }) {
  return (
    <div className="w-full p-6 space-y-4 text-xl leading-normal text-gray-800 rounded-md bg-canvas">
      {children}
    </div>
  );
}

Blog.Author = BlogAuthor;
Blog.Header = BlogHeader;
Blog.Navigation = BlogNavigation;
Blog.Tags = BlogTags;
Blog.Content = BlogContent;
Blog.Card = BlogCard;

export default Blog;
