using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class Tag
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Index(IsUnique= true)]
        public string Name { get; set; }

        public int? Order { get; set; }

        public ICollection<MapQAT> Maps { get; set; }
    }
}
