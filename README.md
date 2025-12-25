# Banker's Algorithm Visualizer
This project is a web-based interactive animation tool that visualizes the Banker's Algorithm, a core operating system concept for deadlock avoidance. It is built entirely with client-side technologies (HTML5, CSS3, and JavaScript) and uses the Canvas API for all animations, as specified by the project requirements.

The application allows users to input custom parameters for processes and resources, and then observe a real-time, step-by-step demonstration of the safety algorithm.

## ✨ Features

This tool implements all core functionality specified in the project brief:

* [cite_start]**Interactive Parameter Input:** Users can dynamically set the number of processes and resources, and then fill in the `Available`, `Max`, and `Allocation` matrices.
* [cite_start]**Step-by-Step Animation:** The visualization runs on the HTML5 Canvas, showing each step of the algorithm's check.
* [cite_start]**Full Animation Controls:** The interface includes controls for **Play/Pause**, **Step-Forward**, and **Step-Backward**.
* [cite_start]**Configurable Speed:** A slider allows the user to adjust the animation speed in real-time.
* [cite_start]**Real-time Visualization:** The tool clearly visualizes the `Allocation`, `Need`, `Work`, and `Finish` data structures.
* [cite_start]**Color-Coded Elements:** The currently inspected process is highlighted, with its row color-coded green if the `Need <= Work` check passes and red if it fails.
* [cite_start]**Real-time Statistics:** The final safe sequence (or a message indicating an unsafe state) is displayed, and a detailed execution log tracks every step.
* [cite_start]**Export Functionality:** A button allows the user to export the current state of the animation canvas as a `.png` screenshot.
* [cite_start]**Modular Code:** The JavaScript is organized into separate modules for UI, the algorithm logic, and the animation/drawing logic, as required.

seems to have an error where in if a new request is put in after succesful execution, it shows false positive even tho element in need matrix is -ve