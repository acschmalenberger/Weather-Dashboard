$( document ).ready(function() {
    
    // $(".cityButton").on("click", function(cityevent){
    //     var $cityBtn=$("button").text();
    //     console.log($cityBtn)

    // })
    //need to connect text from button to search input field
    

    $("button").on("click", function(event) {
        // function clear() {
        //     $(".dashboard").empty();
        // }
        // clear();
        // need to clear betweensearches, syntax  is an issue
       
        event.preventDefault()

        var city = $("input").val();
        localStorage.setItem("city", city)

        var geoCodeURL= "https://geocode.xyz/"
        $.ajax({
            url: geoCodeURL,
            data:{
                auth: '207236170205959156533x5990',
                locate: city,
                json: '1'
            }
        })
            .then(function(data) {
            console.log(data);
            var longitude = (data.longt);
            var latitude = (data.latt);
            
            var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+latitude+"&lon="+longitude+"&units=imperial&exclude=minutely,hourly&appid=62f63f975294c8942205be34ff4aff5a";

            $.ajax({
                url: queryURL,
                method: "GET",
                dataType: "json",
            })
                .then(function(response) {
                    console.log(response);

                    var utcSeconds = (response.current.dt);
                    var d = new Date(utcSeconds * 1000);
                    var iconcode = (response.current.weather[0].icon);
                    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png"

                    $("h2.card-title").append(city);
                    $(".date").append(d);
                    $("#wicon").attr("src",iconurl)
                    $(".temp").append(response.current.temp);
                    $(".humidity").append(response.current.humidity);
                    $(".wind").append(response.current.wind_speed);
                   
                    var uvFinal = (response.current.uvi)
                    var uvBtn = $("<button>").text(uvFinal);
		            $(".uv").append(uvBtn);
		                if (uvFinal < 3) {
                            uvBtn.attr("class", "uvGreen");
		                } else if (uvFinal < 6) {
                            uvBtn.attr("class", "uvYellow");
		                } else if (uvFinal < 8) {
                            uvBtn.attr("class", "uvOrange");
		                } else if (uvFinal < 11) {
			                uvBtn.attr("class", "uvRed");
		                } else {
                            uvBtn.attr("class", "uvPurple");
		                }
    
                    function futForecast(){
                        for (var i=1; i<6; i++ ){
                            var utcSeconds2 = (response.daily[i].dt);
                            var d2 = new Date(utcSeconds2 * 1000);
                            var iconcode2 = (response.daily[i].weather[0].icon);
                            var iconurl2 = "http://openweathermap.org/img/w/" + iconcode2 + ".png"
                            
                            var $forecastCard = $("<ul>");
                            $forecastCard.addClass("list-group");
                            
                            var $date = $("<h5>");
                            $date.append("Date: "+ d2);

                            var $wicon = $("<img>");
                            $wicon.attr("src",iconurl2);
                            $wicon.height("50px");
                            $wicon.width("50px");

                            var $temp = $("<h6>");
                            $temp.append("Temperature: " +response.daily[i].temp.day);

                            var $humidity = $("<h6>");
                            $humidity.append("Humidity: " +response.daily[i].humidity);

                            ($forecastCard).append($date);
                            ($forecastCard).append($wicon);
                            ($forecastCard).append($temp);
                            ($forecastCard).append($humidity);
                            $("#futForecast").append($forecastCard);
                        }
                    }
                    futForecast();
                    
                });
            });
                
    });
    
});
 