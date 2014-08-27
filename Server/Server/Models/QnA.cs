using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class QnA
    {
        public int Id { get; set; }

        [Required]
        public string Question { get; set; }

        public string Answer { get; set; }

        public int? Order { get; set; }

        public ICollection<MapQAT> Maps { get; set; }
    }
}