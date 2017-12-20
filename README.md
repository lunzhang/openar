Augmented Reality for the web

<h1> Technical </h2>
Built using Three.js.
Loads real world into virtual world by displaying camera with video texture.
Syncs the real and virtual camera using computer vision
    1.  Given two sequential frames, convert to grey scale.
    2.  Use FAST feature detector on first frame.
    3.  Track the features on second frame using KLT tracker.
    4.  Compute Essential Matrix using 5 point algorithm with RANSAC from the coressponding features.
    5.  Get camera pose from the Essential matrix.
