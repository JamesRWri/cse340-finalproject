import * as serviceModel from '../models/serviceModel.js';

export async function buildServiceDetail(req, res) {
  res.render("service/detail", { 
    title: "Submit a Service Request" 
  });
}

export async function processServiceBooking(req, res, next) {
  try {
    const { service_vehicle_info, service_description } = req.body;
    const account_id = req.session.user.account_id;
    
    await serviceModel.insertServiceRequest(account_id, service_vehicle_info, service_description);
    req.flash("notice", "Service request submitted successfully.");
    res.redirect("/service/my-requests");
  } catch (error) {
    next(error);
  }
}

export async function buildMyRequests(req, res, next) {
  try {
    const account_id = req.session.user.account_id;
    const history = await serviceModel.getServicesByAccountId(account_id);
    res.render("service/my-requests", { 
      title: "My Service Requests", 
      history 
    });
  } catch (error) {
    next(error);
  }
}

export async function buildServiceManage(req, res, next) {
  try {
    const requests = await serviceModel.getAllServices();
    res.render("service/manage", { 
      title: "Manage Dealership Service Requests", 
      requests 
    });
  } catch (error) {
    next(error);
  }
}

export async function processStatusUpdate(req, res, next) {
  try {
    const { service_id, service_status } = req.body;
    await serviceModel.updateServiceStatus(service_id, service_status);
    req.flash("notice", "Service request status updated successfully.");
    res.redirect("/service/manage");
  } catch (error) {
    next(error);
  }
}