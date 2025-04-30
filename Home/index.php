<!-- Code by Matthew Culley -->
<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <!-- <script src="https://requirejs.org/docs/release/2.3.5/minified/require.js"></script> -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Streaming Simplifier</title>
    <link rel="stylesheet" type="text/css" href="style.css">
    <link rel="icon" type="image" href="images/3Slogo.png">
</head>
<body>
    <h3 id="site-label">Streaming Simplifier</h3>
    <div id="main-container">    
        <div id="logo-box"><img src="images/3Slogo.png" alt="3 S Logo" style="width:35%"> </div>
            <div id="top-container">

                <a id="menu-icon"><img src="images/burgericon.png"></a>

                <div id="slide-menu">
                    <nav>
                        <ul>
                            <li><a id="watchlist-button"><span>Watchlist</span></a></li>
                            <li><a><span>TBD...</span></a></li>
                        </ul>
                    </nav>
                </div>

                <div id="watchlist-menu">
                    <a id="watchlist-menu-back"><img src="images/goBack.png"></a>
                    <!-- <ul>
                        <li>Option 1</li>
                        <li>Option 2</li>
                        <li>Option 3</li>
                        <li>Option 4</li>
                        <li>Option 5</li>
                        <li>Option 6</li>
                        <li>Option 7</li>
                        <li>Option 8</li>
                        <li>Option 9</li>
                        <li>Option 10</li>
                    </ul> -->
                </div>

                <a id="logout">Log Out!</a>
                
                <a href="login" id="account-logo"> <img src="images/login-here.png"> </a>
                
                <a id="account-info"> 
                    <!-- <% if(profilePictureURL) { %> -->
                    <img id="profile-picture" src="images/login-here.png"> 
                </a>
                <form id="pfp-form" action="http://localhost:3000/upload-profile-picture" method="post" enctype="multipart/form-data">
                    <label for="profilePicture" id="upload-lable"><img src="images/cameraicon.png"></label>
                    <input type="file" id="profilePicture" name="profilePicture" accept="image/*"  required />
                    <button type="submit">Confirm</button>
                </form> 
                
                <input type="text" placeholder="Search..." id="search-bar">
                <input type="text" placeholder="Search..." id="empty-search">
                
                <img src="images/searchIcon.png" alt="search-icon" id="search-button"><br/>

            </div>
            <div id="mid-container">
                
                <button id="surprise-button">Surprise Me!</button>

                <button id="reset-button">Clear Search</button>

        <div class="dropdown">

            <button id="drop-button">Sort By ⇩</button>

                <div id="myDropdown" class="dropdown-content">

                    <button id="popular-button">Popular</button> 

                    <button id="current-button">Current</button>

                    <button id="upcoming-button">Upcoming</button>
                    
                    <button id="top-rated-button">Top Rated</button>
                    <!-- probably should make each "a" into a button, give them each a class and an ID 
                         The class will make it so I can edit their CSS all at once, the ID will be for scripting-->

            </div>

        </div>

 
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js"></script>
    <script>
        // import jwt_decode from 'https://esm.sh/jwt-decode';
        if(localStorage.getItem('token')){
            const token = localStorage.getItem('token');
            const decoded = jwt_decode(token);
            const expirationTime = decoded.exp * 1000 - 60000;
            const currentTime = Date.now();

            if (currentTime >= decoded.exp * 1000) {
                // Token expired already
                logoutUser();
            }
        }
        function logoutUser(){
            localStorage.removeItem('token'); // removes the webtoken used being used to retain logged in status
            alert('Your Token expired!');
            location.reload(); //reload the page
        }
    </script>


            
            </div>
            <div id="lower-container">


            <table id="movie-holder">
            <?php
            $cellNum = 1;
            $imgNum = 1;
                for($row = 0; $row <= 3; $row++)
                {
                    echo "<tr>";
                        for($column = 0; $column < 5; $column++) //generates a table with 4 rows and 5 columns
                        { 
                            // assigns a unique ID to each table cell and contained image for dynamic use later
                            echo '<td id=cell'.$cellNum.'><a href="./Details"> <img src="" id="img'.$imgNum.'" alt="" height"100%"></a></td>';
                            $cellNum++;
                            $imgNum++;
                        }
                    echo "</tr>";
                }
            ?>
            </table>


            <button id="next-page">Next Page</button>
            <button id="last-page">Last Page</button>
            
            </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>