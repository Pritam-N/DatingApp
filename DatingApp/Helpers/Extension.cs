using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.Helpers
{
    public static class Extension
    {
        public static void AddApplicationError(this HttpResponse response, string message){
            response.Headers.Add("Applicatione-Error",message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin","*");
        }

        public static int CalculateAge(this DateTime date){
            var age = DateTime.Today.Year - date.Year;

            if (date.AddYears(age) > DateTime.Today){
                age--;
            }
            return age;
        }
    }
}