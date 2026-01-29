import React from "react";
import usePageTitle from "../hooks/usePageTitle";

const AboutPage = () => {
    usePageTitle("About");

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold text-primary mb-3">About BlogSphere</h1>
                        <div className="mx-auto bg-primary" style={{ height: "4px", width: "60px", borderRadius: "2px" }}></div>
                    </div>

                    <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
                        <div className="card-body">
                            <p className="lead text-secondary mb-4">
                                BlogSphere is a social blogging web application designed to provide a simple, engaging, and interactive platform for users to share their thoughts, ideas, and stories. It allows users to create and publish blog posts, interact with content through likes, dislikes, and comments, and manage their profiles with ease.
                            </p>

                            <p className="text-muted mb-4">
                                The platform also includes a powerful admin panel for managing posts and users, along with a real-time dashboard that displays key insights such as total users, posts, and comments. This helps ensure smooth moderation, better content control, and a safe community environment.
                            </p>

                            <p className="text-muted mb-0">
                                BlogSphere is built with a focus on clean design, smooth user experience, and full mobile responsiveness, ensuring seamless access across all devices. The goal of this project is to create a modern blogging platform that combines simplicity, performance, and meaningful user interaction.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
