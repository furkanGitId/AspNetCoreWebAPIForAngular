using System.ComponentModel.DataAnnotations;

namespace AspNetCoreWebAPIForAngular.Models
{
    public class Student
    {
        [Key]
        public int id { get; set; }
        [Required]
        public string? name { get; set; }
    }
}
