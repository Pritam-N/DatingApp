using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace DatingApp.Models
{
    public class State
    {
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        public int CountryId { get; set; }
        //public Country Country { get; set; }

        //public ICollection<City> Cities { get; set; }
    }
}