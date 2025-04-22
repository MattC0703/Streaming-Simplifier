<!-- Code by Matthew Culley -->
<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Movie Details</title>
    <link rel="stylesheet" type="text/css" href="details.css">
    <link rel="icon" type="image" href="images/3Slogo"> 
</head>
<body>
    
    <h3 id="site-label">Streaming Simplifier</h3>
    <div id="main-container">
        <div id="movie-holder">
            <img src="" width="100%"  id="movie-poster">
        </div>
        <h2 id="movie-title">Sample Text</h2>

        <h3 id="movie-desc">No Synopsis</h3>

        <h2 id="movie-rating-label">Rating: </h2>
        <h2 id="movie-rating">No Rating</h2>
        <h2 id="ss-label">
            <span style="color:rgb(255, 54, 54);"><\</span>Streaming Services<span style="color:rgb(255, 54, 54);">/></span></h2>

        <div id="button-holder">
            <a href="./index.php"><img src="images/goBack.png" width="100%"></a>
        </div>

        <div id="mid-container">
            <h1>Buy Here:</h1>
            <table id="provider-table">
                <tr>
                    
                </tr>
            </table>
            
            
        </div>
        <div id="lower-div">
            <h1>Rent Here:</h1>
            <table id="provider-table-rent">
                    <tr>
                        
                    </tr>
                </table>
            </div>

    <!-- <script src="detailsHelper.js"></script> -->
    <script src="details.js"></script>
    </div>


</body>
</html>