namespace Server.Models
{
    public class MapQAT
    {
        public int Id { get; set; }

        public int QnAId { get; set; }

        public virtual QnA QnA { get; set; }

        public int TagId { get; set; }

        public virtual Tag Tag { get; set; }
    }
}
