using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithBrandsAndTypesSpec : BaseSpecification<Product>
    {
        public ProductsWithBrandsAndTypesSpec(ProductSpecParams productParams)
        :base(x =>
            (string.IsNullOrEmpty(productParams.Search) || x.Name.ToLower().Contains(productParams.Search)) &&
            (!productParams.Brandid.HasValue || x.ProductBrandId == productParams.Brandid) &&
            (!productParams.TypeId.HasValue || x.ProductTypeId == productParams.TypeId)
        )
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
            AddOrderBy(x => x.Name);
            ApplyPaging(productParams.PageSize*(productParams.PageIndex-1),
            productParams.PageSize);
            
            switch (productParams.Sort)
            {
                case "priceAsc":
                AddOrderBy(x => x.Price);
                break;
                case "priceDesc":
                AddOrderByDescending(x => x.Price);
                break;
                default:
                AddOrderBy(x => x.Name);
                break;
            }
        }

        public ProductsWithBrandsAndTypesSpec(int id) 
        : base(x => x.Id==id)
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
        }
    }
}