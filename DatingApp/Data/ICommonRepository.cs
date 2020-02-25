using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.Models;

namespace DatingApp.Data
{
    public interface ICommonRepository
    {
        Task<List<Country>> GetCountry();
        Task<List<City>> GetCities(string id);
        Task<List<State>> GetStates(string id);
        Task<bool> AddContactMessage(ContactUs contactUs);
        //Task<bool> SaveAll();
    }
}