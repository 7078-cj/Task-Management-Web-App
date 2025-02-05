<head/>
<style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #ff9a9e, #fad0c4);
            text-align: center;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        h1 {
            font-size: 28px;
            color: #333;
            margin-bottom: 10px;
        }
        p {
            color: #666;
            margin-bottom: 20px;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #ddd;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        }
        .progress-bar::before {
            content: "";
            width: 50%;
            height: 100%;
            background: #ff6f61;
            position: absolute;
            left: 0;
            animation: loading 1.5s infinite ease-in-out;
        }
        @keyframes loading {
            0% { left: 0; }
            50% { left: 50%; }
            100% { left: 100%; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Work in Progress</h1>
        <p>We're working hard to bring you something amazing. Stay tuned!</p>
        <div class="progress-bar"></div>
    </div>
</body>
