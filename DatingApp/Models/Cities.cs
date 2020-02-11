using System.ComponentModel.DataAnnotations.Schema;

namespace DatingApp.Models
{
    public class City
    {
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        public int StateId { get; set; }
        //public State State { get; set; }
    }
}