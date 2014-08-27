using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class GHSkill : IEntity
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int? ParentSkillId { get; set; }

        [ForeignKey("ParentSkillId")]
        [InverseProperty("SubSkills")]
        public GHSkill ParentSkill { get; set; }

        [InverseProperty("ParentSkill")]
        public ICollection<GHSkill> SubSkills { get; set; }

        public ICollection<MapSP> Maps { get; set; }

        public override bool Equals(object obj)
        {
            if (obj is GHSkill)
            {
                return (obj as GHSkill).Name == Name;
            }
            return base.Equals(obj);
        }

        public override int GetHashCode()
        {
            return Name.GetHashCode();
        }
    }
}