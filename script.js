/**
 * @file This file provides functionality to retrieve user profile 
 *        information from Facebook.
 * @description The user profile data can be retrieved from Facebook
 *    with an ACCESS_TOKEN issued for that user. This token is required, 
 *    without it data cannot be obtained. 
 *    The fields required have to be specified as part of the API 
 *    request URL. These fields have been given in the FIELD variable
 *    declared below.
 *    The field data is displayed in respective sections. If some field
 *    data is not available that section is hidden.
 * @author Amrik Singh.
 * @version 0.1 
 */

$(document).ready(function () {

  // Please replace the access token with your own to test the code
  var ACCESS_TOKEN = "EAACEdEose0cBAB13wZBdSUGyQbqz7ZCV4jeolGOVvxnPsOOLoeHNleGocebCkvCKYL06oSrzr1HmUnzuiJfqEOFbQzE4hCEZCZBrMaxICZBMSzoDYInfwTOV5ZBhAhZB8JAT7FUa9NgQevdmgrDWyuP95kWw42aX5ZBzWAxaZCfA3zTW4dVGuVawZCyQTRQztqnSBh3T8ocx4spxQ0x7ZAjfD3NEUNAXHs7YakZD";

  // Below are the fields fetched from Facebook
  var FIELDS = [
      "about",
      "picture.type(large)",
      "cover",
      "education",
      "first_name",
      "last_name",
      "middle_name",
      "name",
      "quotes",
      "favorite_athletes",
      "languages",
      "link",
      "favorite_teams",
      "photos.type(uploaded){picture,link}",
      "posts",
      "music{picture.height(9999).width(9999),name}"
  ];


  var data = null;

  // Make a call to Facebook API and store the response in variable
  data = $.parseJSON($.ajax({
                url: "https://graph.facebook.com/v2.12/me",
                async: false,
                dataType: "json",
                data: {
                    fields: FIELDS.toString(),
                    access_token: ACCESS_TOKEN
                },
                complete: function(){
                  $("#loading-spinner").remove();
                }
            }).responseText
          );

  console.log(data);

  // Check the function argument for null, "Object" as its type and
  // whether that is an empty object
  function isNullOrEmptyObject(val){
    return (val === null || !(val instanceof Object) || jQuery.isEmptyObject(val));
  }

  // Check if the full object field accessor path such as "data.photos.link"
  // is a valid path by checking existance of each object in the path
  // If the path is valid it returns the corresponding object.
  function testObjectPath(fullPath){
    var paths = fullPath.split(".");
    var obj = data;
    for (var i = 0; i < paths.length; i++) {

      if (!obj.hasOwnProperty(paths[i])) {
        return null;
      }
      obj = obj[paths[i]];
    }
    return obj;
  }

  // If Facebook returns a non empty JSON object, look for any error
  // field and if present display the error message. Then terminate
  //  further processing.
  // If Facebook returns empty object then display a standard error
  // message and end the program
  if (!isNullOrEmptyObject(data)) {

    if("error" in data){

      if( !isNullOrEmptyObject(data.error) && "message" in data.error){
        $("#error p").append(data.error.message);
      }else{
        $("#error p").append("An error has occured, please try again later.");
      }

      $("#error").show();
      return;
    }

  }else{
    $("#error p").append("An error has occured, please try again later.");
    $("#error").show();
    return;
  }

  $("footer").css({"position" : "static"});

  // Append name from profile data to page title, brand and footer
  $("title").append(data.name);
  $(".navbar-brand").append(data.name);
  $("footer p").append(data.name);

  // Use facebook cover photo as Hero section image
  var coverPicUrl = testObjectPath("cover.source");
  if(coverPicUrl){
    $("#hero").css({
      "background-image": "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(" + coverPicUrl + ")"
    });
  }else{
    $("#hero").css({
      "background": "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))"
    });
  }


  // Set profile picture from facebook page
  var profilePicUrl = testObjectPath("picture.data.url");
  if(profilePicUrl){
    $(".profile-pic").css({
      "background-image": "url(" + profilePicUrl + ")"
    });
  }else{
    $(".profile-pic").parent().remove();
    $(".first-name").removeClass("col-md-6");
  }

  // Append First name from Facebook in salutation on Hero section
  var firstName = data.first_name ? ("Hello I am " + data.first_name) : "Hello there!";
  $(".first-name p").append(firstName);

  $("#hero").show();

  // Get quote from Facebook
  if(data.quotes && data.quotes.trim()){
    $("#quotes span").append(data.quotes);
    $("#quotes").show();
  }

  // Get self description from Facebbok
  var aboutMe = testObjectPath("about");
  if(aboutMe){
    $("#about-me p").text(aboutMe);
    $("#about-me").show();
  }

  // Get languages from Facebook and construct a sentence
  var languagesList = testObjectPath("languages");
  if(languagesList){
    var noOfLanguages = languagesList.length;
    $.each(languagesList, function (index, value) {

      if (index === noOfLanguages - 1) {
        $("#languages p").append("and " + value.name);
      } else {
        $("#languages p").append(value.name + ", ");
      }
    });
    $("#languages").show();
  }

  // Get each qualification from Facebook
  var educationList = testObjectPath("education");
  if(educationList){
    $.each(educationList, function (index, value) {

      $(".education-content").append("<div class='col-md-6 col-sm-12 text-center text-md-right mb-md-3'><p class='small-text'>" + value.type + "</p></div>");
      $(".education-content").append("<div class='col-md-6 col-sm-12 text-center text-md-left mb-3 border-bottom'><p>" + value.school.name + "</p>");
    });
    $("#education").show();
  }

  // Get list of favourite teams from facebook
  var teamsList = testObjectPath("favorite_teams");
  if(teamsList){
    $.each(teamsList, function (index, value) {
      $(".sports-teams div").append("<p class='border-bottom pb-2 mb-3'><a href='http://www.facebook.com/" + value.id + "'>" + value.name + "</a></p>");
    });
    $("#favourite-teams").show();
  }

  // Get list of favourite music artists from Facebook
  var musicList = testObjectPath("music.data");
  if(musicList){
    $.each(data.music.data, function (index, value) {
      $(".artists div").append("<p><a href='http://www.facebook.com/" + value.id + "'>" + value.name + "</a></p><img src='" + value.picture.data.url + "' class='mb-4 pb-4 border-bottom'>");
    });
    $("#artists").show();
  }


  /*
  The size of smaller versions of uploaded photos returned by facebook is not consistent.
  In the below implemented approach, the smallest size is selected and
  the height and width of all images is set accordingly.
  */

  // set an initial default img height
  var imgHeight = 200;
  // set an initial default img width
  var imgWidth = 200;

  // Stores the dynamicall created image elements
  var uploadedPhotos = [];
  // List of the image facebook links corresponding to each image
  var uploadedPhotosLinks = [];

  // total no of uploaded images in facebook
  var totalUploadedImages = data.photos.data.length;

  // Keep count number of dynamically created HTML image elements
  var currentUploadedImages = 0;

  // This function loops over each HTML image element in the
  // uploadedPhotos array and wraps it with anchor element
  // and also appends it to the "image container" div
  var appendUpploadedImages = function () {

    $.each(uploadedPhotos, function (index, value) {

      var anchor = $("<a>");
      anchor.attr("href", uploadedPhotosLinks[index]);
      value.attr("height", imgHeight).attr("width", imgWidth);

      //wrap image inside anchor tag
      anchor.append(value);

      // Append list of anchor wrapped images to container div
      $(".photos-thumbnails").append(anchor);

    });
  }

  // Loop over list of uploaded images urls sent by facebook and
  // create an HTML image element and set the source path.
  // Then attach a function to the load event that will be
  // called when the image is loaded.
  var uploadedPhotosList = testObjectPath("photos.data");
  if(uploadedPhotosList){
    $.each(uploadedPhotosList, function (index, value) {
      console.log();
      var img = $("<img>");
      img.attr("src", value.picture);

      // Add the full image link in an array
      // This array is processed in appendUpploadedImages()
      // function
      uploadedPhotosLinks.push(value.link);

      // Attach a function to load event.
      // This function will compare the height and width of the
      // image with the minimum height and width saved in
      // imgHeight and imgWidth variables. If it is less
      // then these values will be saved in imgHeight and imgWidth
      img.on('load', function (event) {

        if (this.height < imgHeight) {
          imgHeight = this.height;

        }
        if (this.width < imgWidth) {
          imgWidth = this.width;
        }
        // Save the image element in an array.
        // The array will be processed in appendUpploadedImages()
        // function.
        uploadedPhotos.push($(this));

        // If all images have been loaded call appendUpploadedImages()
        // function
        currentUploadedImages = currentUploadedImages + 1;
        if (currentUploadedImages === totalUploadedImages) {
          appendUpploadedImages();
        }
      });

    });
    $("#uploaded-photos").show();
  }
  // Get facebook posts and append the date and message
  var postsList = testObjectPath("posts.data");
  if(postsList){
    $.each(data.posts.data, function (index, value) {

      var date = new Date(value.created_time);

      $(".posts-content").append("<div class='col-12 col-md-6 text-center text-md-right mb-md-3'><p class='small-text'>" + date.toDateString() + "</p></div>");

      // For some posts the message is stored in story field and
      // for other posts in message field. Get message from these fields
      // and append to posts section
      var msg = value.message !== undefined ? value.message : value.story;

      $(".posts-content").append("<div class='col-12 col-md-6 text-center text-md-left mb-3 border-bottom'><p>" + msg + "</p></div>");

    });
    $("#posts").show();
  }

})
