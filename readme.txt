IMPORTANT
-------------------------------
This code uses online CDN URLs of bootstrap, fontawesome and jquery libraries.
Kindly view the html pages while connected to the Internet.


ACCESS TOKEN
----------------------------------
The facebook profile data is retrieved using access_token of the user.
A javascript variable named ACCESS_TOKEN has been created in script.js file.

Kindly replace the token with your own token as my token would have
expired by then.


GitHub Portfolio repository URL
--------------------------------
https://github.com/amriksarang/assgn3



IMPLEMENTATION
-------------------------------------

Below information is retrieved from user profile.
If any field information is not available, the corresponding
section is hidden.

Number of Photos and Posts have been limited to 20 only

    about
    picture.type(large)
    cover
    education
    first_name
    last_name
    middle_name
    name
    quotes
    favorite_athletes
    languages
    link
    favorite_teams
    photos.type(uploaded).limit(20){picturelink}
    posts.limit(20)
    music{picture.height(9999).width(9999)name}


