namespace Server.Models
{
    public class MapSP : IEntity
    {
        public int Id { get; set; }

        public int GHSkillId { get; set; }

        public virtual GHSkill Skill { get; set; }

        public int GHProjectId { get; set; }

        public virtual GHProject Project { get; set; }
    }
}