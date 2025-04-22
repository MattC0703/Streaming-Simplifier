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
    <link rel="icon" type="image" href="images/3Slogo">
</head>
<body>
    <h3 id="site-label">Streaming Simplifier</h3>
    <div id="main-container">    
        <div id="logo-box"><img src="images/3Slogo.png" alt="3 S Logo" style="width:35%"> </div>
            <div id="top-container">

                <a href="login/login.html" id="account-logo"> <img src="images/login-here.png"> <a>
                <input type="text" placeholder="Search..." id="search-bar">
                <input type="text" placeholder="Search..." id="empty-search">
                <img src="images/searchIcon.png" alt="search-icon" id="search-button"><br/>

                
            
            </div>
            <div id="mid-container">
                
                <button id="surprise-button">Surprise Me!</button>

                <!-- <div class="custom-select">
                    <select>

                        <option>Popular</option>
                        <option>Alphabet</option>
                        <option>New</option>

                    </select>
                    
                </div>  -->

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

 

    <!-- <script>
        function myFunction() {

            var dropdown = document.getElementById("myDropdown");
            
            


            console.log(isShowing);

           // Create a new link element

            // var newLink = document.createElement("a");

            // newLink.href = "#";

            // newLink.textContent = "New Link"; // Set the text of the new link

            

            // // Append the new link to the dropdown

            // dropdown.appendChild(newLink);

        }
    </script> -->


            
            </div>
            <div id="lower-container">


            <table id="movie-holder">
            <?php
            $cellNum = 1;
            $imgNum = 1;
                for($row = 0; $row <= 3; $row++)
                {
                    echo "<tr>";
                        for($column = 0; $column < 5; $column++)
                        {
                            echo '<td id=cell'.$cellNum.'><a href="movieDetails.php"> <img src="" id="img'.$imgNum.'" alt="" height"100%"></a></td>';
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