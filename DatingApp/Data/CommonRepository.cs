using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.Helpers;
using DatingApp.Models;
using Microsoft.EntityFrameworkCore;
namespace DatingApp.Data
{
    public class CommonRepository:ICommonRepository
    {
        public DataContext _context { get; }
        public CommonRepository(DataContext context)
        {
            _context = context;

        }
         public async Task<List<Country>> GetCountry()
        {
            return await _context.Countries.Where(x => 1 == 1).ToListAsync();
        }
        public async Task<List<City>> GetCities(string id)
        {
            int stateid = _context.States.Where(x => x.Name == id).Select(x => x.Id).FirstOrDefault();
            return await _context.Cities.Where(x => x.StateId == stateid).ToListAsync();
        }
        public async Task<List<State>> GetStates(string id)
        {
            int countryid = _context.Countries.Where(x => x.Name == id).Select(x => x.Id).FirstOrDefault();
            return await _context.States.Where(x => x.CountryId == countryid).ToListAsync();
        }
    }
}