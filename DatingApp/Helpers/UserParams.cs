namespace DatingApp.Helpers
{
    public class UserParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 10;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value ; }
        }

        public int UsrId { get; set; }
        public string Gender { get; set; }

        public int MinAge { get; set; } = 14;
        public int MaxAge { get; set; } = 40;
        public string Orderby { get; set; }
        
    }
}