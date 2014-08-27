using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Newtonsoft.Json.Linq;

namespace Server.DAL
{
    public interface IMainProvider
    {
        MainContext Context { get; }

        string Metadata();

        SaveResult SaveChanges(JObject saveBundle, TransactionSettings transactionSettings = null);
    }

    public class MainProvider : EFContextProvider<MainContext>, IMainProvider { }
}
