using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace DatingApp.Models
{
    public class Country
    {
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Abbr { get; set; }
        public int PhoneCode { get; set; }

        //public ICollection<State> States { get; set; }
    }
}