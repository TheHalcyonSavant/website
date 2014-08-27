using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    /// <summary>
    /// All properties must be taken from GitHub
    /// </summary>
    public class GHProject : IEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public ICollection<MapSP> Maps { get; set; }

        public override bool Equals(object obj)
        {
            if (obj is GHProject)
            {
                return (obj as GHProject).Id == Id;
            }
            return base.Equals(obj);
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
    }
}