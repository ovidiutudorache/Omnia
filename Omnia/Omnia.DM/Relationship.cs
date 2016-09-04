using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.DM
{
    public class Relationship
    {
        public int Id { get; set; }
        public int CollectionId { get; set; }
        public int AttributeId { get; set; }
        public int RelatedCollectionId { get; set; }
        public int RelatedAttributeId { get; set; }
    }
}
