// Business logic for batches: search, filter and paginate the batch list.
export class BatchService {
  constructor(batches) {
    this.batches = batches;
  }

  getBatches({ search, status, centre, page, limit }) {
    const matchingBatches = this.filterBatches({ search, status, centre });

    const totalRecords = matchingBatches.length;
    const totalPages = Math.ceil(totalRecords / limit);
    const startIndex = (page - 1) * limit;
    const data = matchingBatches.slice(startIndex, startIndex + limit);

    return {
      data,
      pagination: { page, limit, totalRecords, totalPages },
    };
  }

  filterBatches({ search = '', status = '', centre = '' }) {
    const searchText = search.toLowerCase();

    return this.batches.filter((batch) => {
      const matchesSearch =
        !searchText ||
        batch.batchCode.toLowerCase().includes(searchText) ||
        batch.courseName.toLowerCase().includes(searchText);

      const matchesStatus = !status || batch.status.toLowerCase() === status.toLowerCase();
      const matchesCentre = !centre || batch.centreName.toLowerCase() === centre.toLowerCase();

      return matchesSearch && matchesStatus && matchesCentre;
    });
  }

  // Unique centre names, used to fill the "All Centres" dropdown.
  getCentres() {
    const centreNames = this.batches.map((batch) => batch.centreName);
    return [...new Set(centreNames)].sort();
  }
}
