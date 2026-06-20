const mockVehicles = [
    { id: 1, title: '2021 Ford F-150 Lariat', price: 42500, category: 'Trucks', mileage: '34,000 miles', status: 'Available' },
    { id: 2, title: '2019 Honda Odyssey EX-L', price: 28900, category: 'Vans', mileage: '48,500 miles', status: 'Available' },
    { id: 3, title: '2022 Toyota Camry SE', price: 26400, category: 'Cars', mileage: '18,200 miles', status: 'Available' },
    { id: 4, title: '2020 Jeep Grand Cherokee', price: 31500, category: 'SUVs', mileage: '29,000 miles', status: 'In Service' }
];

const vehicleModel = {
    getInventory: async () => {
        return mockVehicles;
    }
};

export default vehicleModel;