from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, Portfolio, PortfolioStock, db
from app.stock_api import StockAPI

main_bp = Blueprint('main', __name__, url_prefix='/api')

@main_bp.route('/market-index', methods=['GET'])
def get_market_index():
    return jsonify(StockAPI.get_market_index())

@main_bp.route('/top-movers', methods=['GET'])
def get_top_movers():
    return jsonify(StockAPI.get_top_gainers_losers())

@main_bp.route('/stock/<symbol>', methods=['GET'])
def get_stock(symbol):
    return jsonify(StockAPI.get_stock_data(symbol))

@main_bp.route('/portfolios', methods=['GET'])
@jwt_required()
def get_portfolios():
    user_id = get_jwt_identity()
    portfolios = Portfolio.query.filter_by(user_id=user_id).all()
    
    result = []
    for portfolio in portfolios:
        stocks = [{'id': stock.id, 'symbol': stock.symbol} 
                 for stock in portfolio.stocks]
        
        result.append({
            'id': portfolio.id,
            'name': portfolio.name,
            'stocks': stocks
        })
    
    return jsonify(result)

@main_bp.route('/portfolios', methods=['POST'])
@jwt_required()
def create_portfolio():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({'error': 'Portfolio name is required'}), 400
    
    portfolio = Portfolio(name=data['name'], user_id=user_id)
    db.session.add(portfolio)
    db.session.commit()
    
    return jsonify({
        'message': 'Portfolio created successfully',
        'portfolio': {
            'id': portfolio.id,
            'name': portfolio.name
        }
    }), 201

@main_bp.route('/portfolios/<int:portfolio_id>/stocks', methods=['POST'])
@jwt_required()
def add_stock_to_portfolio(portfolio_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('symbol'):
        return jsonify({'error': 'Stock symbol is required'}), 400
    
    portfolio = Portfolio.query.filter_by(id=portfolio_id, user_id=user_id).first()
    if not portfolio:
        return jsonify({'error': 'Portfolio not found or unauthorized'}), 404
    
    # Check if stock already exists in portfolio
    existing = PortfolioStock.query.filter_by(
        portfolio_id=portfolio_id, symbol=data['symbol']).first()
    
    if existing:
        return jsonify({'error': 'Stock already in portfolio'}), 400
    
    # Validate stock symbol with API
    stock_data, status = StockAPI.get_stock_data(data['symbol'])
    if 'error' in stock_data:
        return jsonify({'error': 'Invalid stock symbol'}), 400
    
    stock = PortfolioStock(symbol=data['symbol'], portfolio_id=portfolio_id)
    db.session.add(stock)
    db.session.commit()
    
    return jsonify({
        'message': 'Stock added successfully',
        'stock': {'id': stock.id,
            'symbol': stock.symbol
        }
    }), 201

@main_bp.route('/portfolios/<int:portfolio_id>/stocks/<int:stock_id>', methods=['DELETE'])
@jwt_required()
def remove_stock_from_portfolio(portfolio_id, stock_id):
    user_id = get_jwt_identity()
    
    portfolio = Portfolio.query.filter_by(id=portfolio_id, user_id=user_id).first()
    if not portfolio:
        return jsonify({'error': 'Portfolio not found or unauthorized'}), 404
    
    stock = PortfolioStock.query.filter_by(id=stock_id, portfolio_id=portfolio_id).first()
    if not stock:
        return jsonify({'error': 'Stock not found in portfolio'}), 404
    
    db.session.delete(stock)
    db.session.commit()
    
    return jsonify({'message': 'Stock removed successfully'}), 200

@main_bp.route('/portfolios/<int:portfolio_id>', methods=['DELETE'])
@jwt_required()
def delete_portfolio(portfolio_id):
    user_id = get_jwt_identity()
    
    portfolio = Portfolio.query.filter_by(id=portfolio_id, user_id=user_id).first()
    if not portfolio:
        return jsonify({'error': 'Portfolio not found or unauthorized'}), 404
    
    # Delete all stocks in the portfolio
    PortfolioStock.query.filter_by(portfolio_id=portfolio_id).delete()
    
    db.session.delete(portfolio)
    db.session.commit()
    
    return jsonify({'message': 'Portfolio deleted successfully'}), 200
